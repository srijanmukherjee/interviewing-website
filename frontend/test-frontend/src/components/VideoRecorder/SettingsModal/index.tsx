import { Alert, Box, Checkbox, Modal, Overlay, Progress, Select, Tabs } from '@mantine/core';
import { IconAlertCircle, IconMicrophone, IconVideo } from '@tabler/icons-react';
import { useStyles } from '../style';
import { useEffect, useState } from 'react';

interface Props {
	opened: boolean;
	close: () => void;
	videoInputs: MediaDeviceInfo[];
	audioInputs: MediaDeviceInfo[];
	audioOutputs: MediaDeviceInfo[];
	mirrorVideo: boolean;
	setMirrorVideo: (checked: boolean) => void;
	noiseSuppression: boolean;
	setNoiseSuppression: (checked: boolean) => void;
	echoCancellation: boolean;
	setEchoCancellation: (checked: boolean) => void;
	stream: MediaStream | undefined;
	audioInputId?: string;
	setAudioInputId: (id: string) => void;
	audioOutputId?: string;
	setAudioOutputId: (id: string) => void;
	videoId?: string;
	setVideoId: (id: string) => void;
	hasPermission: boolean;
	recordingInProgress: boolean;
}

export default function SettingsModal({
	opened,
	close,
	videoInputs,
	mirrorVideo,
	setMirrorVideo,
	audioInputs,
	audioOutputs,
	noiseSuppression,
	setNoiseSuppression,
	echoCancellation,
	setEchoCancellation,
	audioInputId,
	setAudioInputId,
	audioOutputId,
	setAudioOutputId,
	videoId,
	setVideoId,
	stream,
	hasPermission,
	recordingInProgress,
}: Props) {
	const { classes } = useStyles();
	const [microphoneLevel, setMicrophoneLevel] = useState<number>(0);
	const [sinkSupported, setSinkSupported] = useState<boolean>(true);

	useEffect(() => {
		if (!stream) return;

		// microphone level
		const audioContext = new AudioContext();
		const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
		const analyserNode = audioContext.createAnalyser();
		mediaStreamAudioSourceNode.connect(analyserNode);

		const pcmData = new Float32Array(analyserNode.fftSize);
		const onFrame = () => {
			analyserNode.getFloatTimeDomainData(pcmData);
			let sumSquares = pcmData.reduce((sum, currentValue) => sum + currentValue * currentValue, 0);
			setMicrophoneLevel(Math.sqrt(sumSquares / pcmData.length));
			window.requestAnimationFrame(onFrame);
		};

		window.requestAnimationFrame(onFrame);
	}, [stream]);

	useEffect(() => {
		const el = document.createElement('audio');
		if ((el as any).sinkId === undefined) setSinkSupported(false);
	}, []);

	return (
		<Modal opened={opened} onClose={close} title="Settings" centered className={classes.settingsModal} size="lg">
			<Tabs orientation="vertical" defaultValue="video">
				<Tabs.List defaultValue="video">
					<Tabs.Tab value="video" icon={<IconVideo size={16} />}>
						Video
					</Tabs.Tab>
					<Tabs.Tab value="audio" icon={<IconMicrophone size={16} />}>
						Audio
					</Tabs.Tab>
				</Tabs.List>

				<Box px={20} w="100%" style={{ position: 'relative' }}>
					<Tabs.Panel value="video">
						{recordingInProgress && (
							<Alert color="yellow" mb="lg">
								Recording in progress
							</Alert>
						)}
						<Select
							label="Camera"
							data={videoInputs.map((device) => ({ label: device.label, value: device.deviceId }))}
							onChange={setVideoId}
							value={videoId ?? (videoInputs.length > 0 ? videoInputs[0].deviceId : null)}
							mb={20}
							disabled={recordingInProgress}
						/>
						<Checkbox
							label="Mirror video"
							checked={mirrorVideo}
							onChange={(event) => setMirrorVideo(event.currentTarget.checked)}
							disabled={recordingInProgress}
						/>

						{!hasPermission && (
							<Overlay opacity={0.85} style={{ display: 'grid', placeItems: 'center' }}>
								<Alert icon={<IconAlertCircle size={16} />} color="red">
									Allow permission to access camera
								</Alert>
							</Overlay>
						)}
					</Tabs.Panel>
					<Tabs.Panel value="audio">
						{recordingInProgress && (
							<Alert color="yellow" mb="lg">
								Recording in progress
							</Alert>
						)}
						<Select
							label="Microphone"
							data={audioInputs.map((device) => ({ label: device.label, value: device.deviceId }))}
							value={audioInputId ?? (audioInputs.length > 0 ? audioInputs[0].deviceId : null)}
							onChange={setAudioInputId}
							mb="lg"
							disabled={recordingInProgress}
						/>
						<Progress
							value={Math.round(microphoneLevel * 100)}
							mb="lg"
							label={Math.round(microphoneLevel * 100) + '%'}
							size="xl"
							style={{ transition: 'none' }}
						/>
						<Checkbox
							label="Noise suppression"
							checked={noiseSuppression}
							onChange={(ev) => setNoiseSuppression(ev.currentTarget.checked)}
							mb="lg"
							disabled={recordingInProgress}
						/>
						<Checkbox
							label="Echo cancellation"
							checked={echoCancellation}
							onChange={(ev) => setEchoCancellation(ev.currentTarget.checked)}
							mb="lg"
							disabled={recordingInProgress}
						/>
						<Select
							label="Speaker"
							data={audioOutputs.map((device) => ({ label: device.label, value: device.deviceId }))}
							value={audioOutputId ?? (audioOutputs.length > 0 ? audioOutputs[0].deviceId : null)}
							onChange={setAudioOutputId}
							disabled={recordingInProgress}
						/>

						{!sinkSupported && (
							<Alert mt="lg" icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="yellow">
								Audio output feature is not supported by your browser.
							</Alert>
						)}

						{!hasPermission && (
							<Overlay opacity={0.85} style={{ display: 'grid', placeItems: 'center' }}>
								<Alert icon={<IconAlertCircle size={16} />} color="red">
									Allow permission to access audio
								</Alert>
							</Overlay>
						)}
					</Tabs.Panel>
				</Box>
			</Tabs>
		</Modal>
	);
}
