# Third-party runtime dependencies

Mira Nihongo loads browser ML libraries from jsDelivr:
- TensorFlow.js 4.22.0 — Apache-2.0
- TensorFlow.js COCO-SSD 2.2.3 — Apache-2.0
- TensorFlow.js MobileNet 2.1.1 — Apache-2.0
- TensorFlow.js DeepLab — Apache-2.0
- TensorFlow.js Hand Pose Detection — Apache-2.0

Model assets are fetched by the corresponding libraries at runtime. RC3 uses DeepLab/ADE20K for semantic segmentation and MediaPipe Hands through the TensorFlow.js hand-pose-detection API with the TFJS runtime.
