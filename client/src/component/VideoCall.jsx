import React, { useEffect, useState, useRef } from 'react';
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import axios from 'axios';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Loader2, VideoOff } from 'lucide-react';

const baseUrl = import.meta.env.VITE_API_URL;

const VideoCall = ({ callId, name, role }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const isCleaningUp = useRef(false);

  useEffect(() => {
    const initCall = async () => {
      try {
        const res = await axios.post(`${baseUrl}/api/stream/get-token`, {}, { withCredentials: true });
        const { token, apiKey, userId } = res.data;

        const user = {
          id: userId,
          name,
          image: `https://getstream.io/random_svg/?id=${userId}&name=${userId}`,
        };

        const videoClient = new StreamVideoClient({ apiKey, user, token });
        const streamCall = videoClient.call('default', callId);
        await streamCall.join({ create: true });

        setClient(videoClient);
        setCall(streamCall);
      } catch (err) {
        console.error('Stream init error:', err);
      }
    };

    initCall();
  }, [callId, name]);

  useEffect(() => {
    if (!call) return;

    const handleCallEnd = () => {
      if (!isCleaningUp.current) {
        isCleaningUp.current = true;
        call.leave().catch(console.error);
        setCallEnded(true);
      }
    };

    const handleParticipantLeft = () => {
      const activeParticipants = Object.keys(call.state.participants || {});
      if (activeParticipants.length <= 1 && !isCleaningUp.current) {
        isCleaningUp.current = true;
        call.leave().catch(console.error);
        setCallEnded(true);
      }
    };

    call.on('call.ended', handleCallEnd);
    call.on('participant.left', handleParticipantLeft);

    return () => {
      call.off('call.ended', handleCallEnd);
      call.off('participant.left', handleParticipantLeft);
    };
  }, [call]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (call && !isCleaningUp.current) {
        isCleaningUp.current = true;
        call.leave().catch(console.error);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [call]);

  if (callEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center animate-fadeIn">
        <VideoOff size={64} className="text-red-500 mb-4 animate-pulse" />
        <h2 className="text-3xl font-bold">Call Ended</h2>
        <p className="text-gray-400 mt-2">Thank you for using <span className="text-teal-400 font-semibold">Triksha ✨</span></p>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white animate-fadeIn">
        <Loader2 className="animate-spin text-teal-400 w-10 h-10 mb-4" />
        <p className="text-lg font-medium">Setting up your call...</p>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI role={role} />
      </StreamCall>
    </StreamVideo>
  );
};

const CallUI = ({ role }) => {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const call = useCall();

  const isDoctor = role === 'doctor';
  const someoneElseJoined = participants.length > 1;

  if (callingState !== 'joined' || !someoneElseJoined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center animate-fadeIn">
        <Loader2 className="animate-spin text-teal-400 w-10 h-10 mb-4" />
        <p className="text-lg font-medium">
          {isDoctor ? 'Waiting for patient to join...' : 'Waiting for doctor to join...'}
        </p>
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls
        onLeave={() => {
          call.endCall().catch(console.error);
        }}
      />
    </StreamTheme>
  );
};

export default VideoCall;
