import { CommonModule } from '@angular/common';
import { Component,ElementRef,ViewChild } from '@angular/core';
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { ImageCroppedEvent, ImageCropperComponent, ImageCropperModule } from 'ngx-image-cropper';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageCropperModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ImageWizard';
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
  @ViewChild('cropper') cropper!: ElementRef<ImageCropperComponent>;

  imageChangedEvent: any = '';
    croppedImage: any = '';
    blob: any;
    format: string= "jpeg";
    constructor(
      private sanitizer:DomSanitizer
    ){

    }
    
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage =this.sanitizer.bypassSecurityTrustUrl(event.base64 || event.objectUrl||'') ;
        console.log("image cropped in cropper", this.croppedImage)
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    saveCroppedImage():void{
      if(this.croppedImage){
        const blob = this.base64toBlob(this.croppedImage);

        const anchor = document.createElement('a');
        anchor.href=  window.URL.createObjectURL(blob);
        anchor.download = 'cropped_image.jpeg'
        anchor.click();
      }
    }

    private base64toBlob(base6String: string):Blob {
      console.log("in blob",this.croppedImage);
      const base64EithoutPrefix = base6String.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/,'')
      const byteCharacters = atob(decodeURIComponent(base64EithoutPrefix));
      const byteNumbers = new Array(byteCharacters.length);
      for(let i = 0; i < byteCharacters.length; i++){
        
        byteNumbers[i] = byteCharacters.charCodeAt(i);

      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray],{type:undefined});
    }
}
