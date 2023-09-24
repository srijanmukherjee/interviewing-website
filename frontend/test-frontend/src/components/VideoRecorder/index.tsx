'use client';

import { DEFAULT_VIDEO_DURATION_LIMIT } from '@/constants';
import {
	Alert,
	Box,
	Button,
	Flex,
	Group,
	Loader,
	Overlay,
	Progress,
	Text,
	Tooltip,
	Transition,
	UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { useStyles } from './style';
import {
	IconCameraFilled,
	IconCameraPause,
	IconExclamationCircle,
	IconPlayerPlayFilled,
	IconPlayerRecord,
	IconPlayerRecordFilled,
	IconSettings,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import SettingsModal from './SettingsModal';
import humanizeDuration from 'humanize-duration';
import RecordRTC from 'recordrtc';
import { useQuestion } from '@/context/QuestionContext';

async function getMediaDevices() {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const audioInputs = devices.filter((device) => device.kind === 'audioinput');
	const audioOutputs = devices.filter((device) => device.kind === 'audiooutput');
	const videoInputs = devices.filter((device) => device.kind === 'videoinput');
	return [audioInputs, audioOutputs, videoInputs];
}

function stopMediaStream(mediaStream: MediaStream) {
	mediaStream.getTracks().forEach((track) => track.stop());
}

// TODO:
// me or future developer. clean up this mess
// Replace useStates with reducers
export default function VideoRecorder() {
	const { classes } = useStyles();

	const { question, submitting, onSubmit } = useQuestion();
	const durationLimit = question.parameters?.durationLimit ?? DEFAULT_VIDEO_DURATION_LIMIT;

	const [opened, { open, close }] = useDisclosure(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [isCameraBlack, setIsCameraBlack] = useState<boolean>(false);

	// stream
	const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
	const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
	const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
	const mediaStream = useRef<MediaStream>();

	// video/audio properties
	const [mirrorVideo, setMirrorVideo] = useState<boolean>(false);
	const [noiseSuppression, setNoiseSuppression] = useState<boolean>(true);
	const [echoCancellation, setEchoCancellation] = useState<boolean>(true);
	const [videoId, setVideoId] = useState<string>();
	const [audioInputId, setAudioInputId] = useState<string>();
	const [audioOutputId, setAudioOutputId] = useState<string>();

	// mediadevice permissions
	const [hasPermission, setHasPermission] = useState<boolean>(true);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const recorderRef = useRef<RecordRTC>();

	// video recording states
	const [recording, setRecording] = useState<boolean>(false);
	const [stopRecordingDisabled, setStopRecordingDisabled] = useState<boolean>(false);
	const [videoRecorded, setVideoRecorded] = useState<boolean>(false);
	const [elapsedTime, setElapsedTime] = useState<number>(0);
	const [recordedBlob, setRecordedBlob] = useState<Blob>();
	const [previewing, setPreviewing] = useState<boolean>(false);

	// toggle between preview and camera button
	const togglePreviewCamera = () => {
		if (!videoRef.current || !recordedBlob) return;

		// switch back to camera
		if (previewing) {
			const objectUrl = videoRef.current.src;

			if (objectUrl.startsWith('blob:')) {
				videoRef.current.src = '';
				URL.revokeObjectURL(objectUrl);
			}

			videoRef.current.srcObject = mediaStream.current ?? null;
			videoRef.current.controls = false;
			videoRef.current.muted = true;
			videoRef.current.volume = 0;
		}

		// preview the recorded video
		else {
			const objectUrl = URL.createObjectURL(recordedBlob);
			videoRef.current.srcObject = null;
			videoRef.current.src = objectUrl;
			videoRef.current.controls = true;
			videoRef.current.muted = false;
			videoRef.current.volume = 1;
			videoRef.current.load();
		}

		setPreviewing((v) => !v);
	};

	// get and set blob from the recorder
	const handleVideBlob = () => {
		if (!recorderRef.current) return;
		const blob: Blob = recorderRef.current.getBlob();
		setRecordedBlob(blob);
	};

	// toggle between record and stop button
	const toggleRecord = () => {
		// check if recorder is available
		if (!recorderRef.current) {
			notifications.show({
				title: 'Internal error',
				message: 'Recording service not loaded',
				color: 'red',
			});
			return;
		}

		if (recording) {
			setRecording(false);
			setVideoRecorded(true);
			recorderRef.current.stopRecording(() => {
				handleVideBlob();
			});
		} else {
			setStopRecordingDisabled(true);
			setRecording(true);
			setTimeout(() => {
				setStopRecordingDisabled(false);
			}, 2000);

			recorderRef.current.reset();
			recorderRef.current.startRecording();
		}
	};

	const onRecorderStateChange = (state: RecordRTC.State) => {
		if (state === 'stopped') {
			setVideoRecorded(true);
			setRecording(false);
			handleVideBlob();
		}
	};

	// main media handling code
	useEffect(() => {
		if (mediaStream.current) stopMediaStream(mediaStream.current);
		if (recorderRef.current) recorderRef.current?.stopRecording();

		let recorderStateObserverIntervalId: NodeJS.Timeout | null = null;
		let previousState: string = '';

		setLoading(true);
		navigator.mediaDevices
			.getUserMedia({
				video: {
					deviceId: videoId,
					width: { ideal: 4096 },
					height: { ideal: 2160 },
				},
				audio: {
					deviceId: audioInputId,
					noiseSuppression: noiseSuppression,
					echoCancellation: echoCancellation,
				},
			})
			.then(async (stream) => {
				mediaStream.current = stream;
				if (videoRef.current) {
					videoRef.current.controls = false;
					videoRef.current.volume = 0;
					videoRef.current.muted = true;
					videoRef.current.srcObject = stream;
				}

				const [_audioInputs, _audioOutputs, _videoInputs] = await getMediaDevices();
				setAudioInputs(_audioInputs);
				setAudioOutputs(_audioOutputs);
				setVideoInputs(_videoInputs);

				// setup recorder
				recorderRef.current = new RecordRTC(stream, {
					disableLogs: true,
					numberOfAudioChannels: 2,
				});

				recorderRef.current.setRecordingDuration(durationLimit!);

				// monitor changes in the recorder
				recorderStateObserverIntervalId = setInterval(() => {
					if (!recorderRef.current) return;
					const state = recorderRef.current.getState();

					if (state !== previousState) {
						onRecorderStateChange(state);
					}

					previousState = state;
				}, 500);

				// when settings changed, set previewing=false
				setPreviewing(false);
			})
			.catch((error: DOMException) => {
				if (error.name === 'NotAllowedError') {
					setHasPermission(false);
				} else if (error.name === 'NotFoundError') {
					setHasPermission(false);
				} else {
					// TODO: handle unknown error
					console.log(error);
				}
			})
			.finally(() => {
				setLoading(false);
			});

		return () => {
			if (mediaStream.current) stopMediaStream(mediaStream.current);
			recorderRef.current?.stopRecording();
			if (recorderStateObserverIntervalId) clearInterval(recorderStateObserverIntervalId);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [videoId, audioInputId, noiseSuppression, echoCancellation, recorderRef, durationLimit]);

	// check whether camera video stream is dark/black
	useEffect(() => {
		if (!videoRef.current || !canvasRef.current || !hasPermission) return;

		const video = videoRef.current;

		const cameraBlackCheckInterval = setInterval(() => {
			canvasRef.current
				?.getContext('2d')
				?.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
			const data = canvasRef.current
				?.getContext('2d')
				?.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
			if (!data) return;

			const rgb = { r: 0, g: 0, b: 0 };
			const blockSize = 5;
			let count = 0;

			for (let i = 0; i < data.data.length; i += blockSize * 4) {
				count++;
				rgb.r += data.data[i] / 255;
				rgb.g += data.data[i + 1] / 255;
				rgb.b += data.data[i + 2] / 255;
			}

			rgb.r = rgb.r / count;
			rgb.g = rgb.g / count;
			rgb.b = rgb.b / count;
			const dist = (rgb.r + rgb.g + rgb.b) / 3;
			setIsCameraBlack(dist < 0.2);
		}, 2000);

		return () => {
			clearInterval(cameraBlackCheckInterval);
		};
	}, [videoRef, canvasRef, hasPermission]);

	// video recording timer
	useEffect(() => {
		if (!recording) {
			return;
		}

		let id = setInterval(() => {
			setElapsedTime((v) => v + 1);
		}, 1000);

		return () => {
			clearInterval(id);
			setElapsedTime(0);
		};
	}, [recording]);

	return (
		<>
			<Flex direction="column" rowGap={7} className={classes.container}>
				<Flex h="100%" direction="column" style={{ overflow: 'auto' }}>
					{/* Toolbar */}
					<Flex className={classes.toolbar}>
						<Group pl="sm">
							<Text sx={(theme) => ({ color: theme.colors.gray[6] })} size="sm">
								Limit: {humanizeDuration(durationLimit!)}
							</Text>
						</Group>
						<Group position="right" spacing={0}>
							{/* TODO: Add full screen button */}
							{/* <UnstyledButton>
								<IconMaximize size={16} />
							</UnstyledButton> */}
							<UnstyledButton onClick={open}>
								<IconSettings size={16} />
							</UnstyledButton>
						</Group>
					</Flex>
					{/* Recording area */}
					<Flex
						p={10}
						align="center"
						justify="center"
						sx={(theme) => ({
							backgroundColor: theme.colors.dark[7],
							overflow: 'auto',
							flexGrow: 0,
							flexBasis: '100%',
						})}>
						<Box
							sx={(theme) => ({
								aspectRatio: '16/9',
								width: '100%',
								borderRadius: '5px',
								overflow: 'hidden',
								backgroundColor: theme.colors.dark[9],
								maxWidth: '1080px',
								position: 'relative',
							})}>
							{loading && (
								<Flex
									style={{
										height: '100%',
										width: '100%',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Loader size={24} />
								</Flex>
							)}
							{!hasPermission && (
								<Flex
									style={{
										height: '100%',
										width: '100%',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Alert color="red" icon={<IconExclamationCircle size={24} />}>
										Please allow access to camera and microphone
									</Alert>
								</Flex>
							)}
							<video
								ref={videoRef}
								width={'100%'}
								height={'100%'}
								muted
								autoPlay
								style={{
									transform: mirrorVideo ? 'scaleX(-1)' : undefined,
									display: loading || !hasPermission ? 'none' : 'block',
								}}
							/>
							<Transition transition="fade" duration={400} mounted={isCameraBlack && !previewing}>
								{(styles) => (
									<Overlay opacity={0.65} center style={styles}>
										<Alert icon={<IconCameraPause />}>Please make sure you have enough light</Alert>
									</Overlay>
								)}
							</Transition>
						</Box>
					</Flex>
				</Flex>
				<Flex className={classes.bottomBar}>
					<Flex
						pr="sm"
						style={{
							flexGrow: 1,
						}}
						align={'center'}>
						{videoRecorded && (
							<Button
								size="xs"
								color="secondary"
								mr="sm"
								disabled={recording || recordedBlob === undefined}
								onClick={togglePreviewCamera}
								leftIcon={
									previewing ? <IconCameraFilled size={16} /> : <IconPlayerPlayFilled size={16} />
								}>
								{previewing ? 'Camera' : 'Preview'}
							</Button>
						)}
						<Box style={{ flexGrow: 1 }}>
							<Progress size="xs" value={(elapsedTime * 1000 * 100) / durationLimit!} />
						</Box>
						<Text ml={10} size="xs">
							{Math.floor((durationLimit! / 1000 - elapsedTime) / 60)
								.toString()
								.padStart(2, '0')}
							:{((durationLimit! / 1000 - elapsedTime) % 60).toString().padStart(2, '0')}
						</Text>
					</Flex>
					<Group spacing="xs" position="right">
						<Button
							bg="gray"
							size="xs"
							variant="default"
							leftIcon={
								recording ? (
									<IconPlayerRecordFilled
										size={16}
										style={{ color: stopRecordingDisabled ? 'gray' : 'red' }}
									/>
								) : (
									<IconPlayerRecord size={16} color={hasPermission ? 'red' : 'gray'} />
								)
							}
							disabled={!hasPermission || (recording && stopRecordingDisabled) || submitting}
							onClick={toggleRecord}>
							{recording ? 'Stop' : 'Record'}
						</Button>
						<Tooltip label={'Submit response'}>
							<Button
								color="primary"
								sx={{ color: 'black' }}
								size="xs"
								disabled={!hasPermission || !videoRecorded || recording}
								onClick={() => onSubmit({ blob: recordedBlob! })}
								loading={submitting}>
								Submit
							</Button>
						</Tooltip>
					</Group>
				</Flex>
			</Flex>
			<SettingsModal
				opened={opened}
				close={close}
				audioInputs={audioInputs}
				audioOutputs={audioOutputs}
				videoInputs={videoInputs}
				noiseSuppression={noiseSuppression}
				setNoiseSuppression={setNoiseSuppression}
				echoCancellation={echoCancellation}
				setEchoCancellation={setEchoCancellation}
				mirrorVideo={mirrorVideo}
				setMirrorVideo={setMirrorVideo}
				stream={mediaStream.current}
				audioInputId={audioInputId}
				setAudioInputId={setAudioInputId}
				audioOutputId={audioOutputId}
				setAudioOutputId={setAudioOutputId}
				videoId={videoId}
				setVideoId={setVideoId}
				hasPermission={hasPermission}
				recordingInProgress={recording}
			/>
			<canvas ref={canvasRef} width={160} height={120}></canvas>
		</>
	);
}
