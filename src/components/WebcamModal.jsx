import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, X, AlertCircle } from 'lucide-react';

export default function WebcamModal({ isOpen, onClose, onSubmitPhoto, topicTitle }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState('');

  const startCamera = async () => {
    setCameraError('');
    setCapturedPhoto(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      setCameraError('Camera access denied or unavailable. Please grant camera permission in your browser.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    startCamera();
  };

  const handleSubmit = () => {
    if (capturedPhoto) {
      onSubmitPhoto(capturedPhoto);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-4 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              📷 Real Camera Biometric Verification
            </span>
            <h3 className="text-base font-black text-white mt-0.5">
              Live Attendance Photo: {topicTitle || 'React Session'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Display View */}
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
          {cameraError ? (
            <div className="p-6 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-xs text-rose-300 font-semibold">{cameraError}</p>
              <button onClick={startCamera} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-white font-bold">
                Retry Camera Access
              </button>
            </div>
          ) : capturedPhoto ? (
            <div className="relative w-full h-full">
              <img src={capturedPhoto} alt="Captured Attendance" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                ✓ Photo Captured
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Camera Feed Active
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between gap-3">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Retake Photo
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit to Trainer
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!!cameraError}
              onClick={handleCapture}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer tracking-wider uppercase"
            >
              <Camera className="w-4 h-4" /> Capture Attendance Photo
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
