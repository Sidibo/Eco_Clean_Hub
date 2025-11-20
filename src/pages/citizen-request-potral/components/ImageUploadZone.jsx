import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUploadZone = ({ onImageSelect, selectedImage, onImageRemove }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const imageFile = files?.find(file => file?.type?.startsWith('image/'));
    
    if (imageFile) {
      processImage(imageFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      processImage(file);
    }
  };

  const processImage = (file) => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        file: file,
        preview: e?.target?.result,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setIsProcessing(false);
        onImageSelect(imageData);
      }, 1000);
    };
    reader?.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef?.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  if (selectedImage) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground font-inter">
              Selected Image
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onImageRemove}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="text-error hover:text-error/80"
            >
              Remove
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-muted">
            <Image
              src={selectedImage?.preview}
              alt="Selected waste bin photo for collection request"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium">{selectedImage?.name}</p>
                  <p className="text-xs opacity-80">{formatFileSize(selectedImage?.size)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Camera" size={16} />
                  <span className="text-xs">Ready for analysis</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleBrowseClick}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
              fullWidth
            >
              Replace Image
            </Button>
            <Button
              variant="outline"
              onClick={handleCameraClick}
              iconName="Camera"
              iconPosition="left"
              iconSize={16}
              fullWidth
            >
              Take New Photo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center civic-transition ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground font-inter">
                Processing Image
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Preparing your photo for AI analysis...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Camera" size={40} className="text-primary" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground font-inter">
                Upload Waste Bin Photo
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Take a clear photo of the waste bin or drag and drop an image file here. 
                Our AI will analyze the fill level automatically.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <Button
                  variant="default"
                  onClick={handleCameraClick}
                  iconName="Camera"
                  iconPosition="left"
                  iconSize={18}
                  fullWidth
                  className="touch-target"
                >
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBrowseClick}
                  iconName="Upload"
                  iconPosition="left"
                  iconSize={18}
                  fullWidth
                  className="touch-target"
                >
                  Browse Files
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WebP (Max 10MB)
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Shield" size={12} className="text-success" />
                  <span>Secure Upload</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Zap" size={12} className="text-accent" />
                  <span>AI Analysis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Lock" size={12} className="text-primary" />
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUploadZone;