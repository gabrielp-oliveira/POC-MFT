import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[DropZone]'
})
export class DropzoneDirective {
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.opacity') private opacity = '1';
  @HostBinding('style.border') private border = '2px dashed #702cac;';
  @HostBinding('style.background') private background = 'white';

  @HostListener('dragover', ['$event']) public onDragOver(evt:Event): any {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '0.4';
    this.background = '#ffedde';
    this.border = '2px dashed #702cac;';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt:Event): any {
    evt.preventDefault();
    evt.stopPropagation();
    this.opacity = '1';
    this.background = 'white';
    this.border = '2px dashed #702cac;';
  }

  @HostListener('drop', ['$event']) public ondrop(evt:any): any {
    evt.preventDefault();
    evt.stopPropagation();
    console.log(evt)
    this.opacity = '1';
    this.background = 'white';
    this.border = '2px dashed #702cac;';
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }
}