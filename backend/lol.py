import torch
print("PyTorch version:", torch.__version__)
print("Using CUDA:", torch.cuda.is_available())
# 1. Define the device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# 2. Create a tensor and move it to the device
x = torch.randn(3, 3).to(device)
print(f"Tensor on device: {x.device}")

# 3. Perform an operation on the GPU
y = x * 2
print(f"Result on device: {y.device}")


import transformers
print(transformers.__version__)
