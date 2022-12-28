import { useEffect, useState } from 'react';

export const useCreateMediaStream = (localVideoRef) => {
  const [userMediaStream, setUserMediaStream] = useState(null);

  const createMediaStream = async () => {
    if (navigator !== undefined) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const defaultCamera = devices.find(d => !d.label.includes('OBS'));
      const stream = await navigator?.mediaDevices?.getUserMedia({
        video: {
          deviceId: defaultCamera?.deviceId ? defaultCamera?.deviceId : undefined,
          width: { min: 640, ideal: 1920 },
          height: { min: 400, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        audio: true,
      });

      if(localVideoRef && localVideoRef.current && localVideoRef.current.srcObject){
        localVideoRef.current.srcObject = stream;
      }
      

      setUserMediaStream(stream);
    }
  };

  useEffect(() => {
    createMediaStream();
  }, [localVideoRef]);

  return userMediaStream;
};
