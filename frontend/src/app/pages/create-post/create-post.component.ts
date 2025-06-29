import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../services/post';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  createPostForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.createPostForm = this.fb.group({
      caption: ['', [Validators.maxLength(2200)]],
      location: ['', [Validators.maxLength(100)]]
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Por favor selecciona un archivo de imagen válido';
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.error = 'La imagen debe ser menor a 10MB';
        return;
      }

      this.selectedFile = file;
      this.error = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.error = 'Por favor selecciona una imagen';
      return;
    }

    if (this.createPostForm.valid) {
      this.loading = true;
      this.error = '';

      // In a real app, you would upload the image to a service like Cloudinary
      // For now, we'll use a placeholder URL
      const imageUrl = URL.createObjectURL(this.selectedFile);
      
      const postData = {
        imageUrl: imageUrl, // This should be the uploaded image URL from your image service
        caption: this.createPostForm.value.caption || undefined,
        location: this.createPostForm.value.location || undefined
      };

      this.postService.createPost(postData).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.loading = false;
          this.error = error.error?.message || 'Error al crear el post';
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  get caption() { return this.createPostForm.get('caption'); }
  get location() { return this.createPostForm.get('location'); }
}
