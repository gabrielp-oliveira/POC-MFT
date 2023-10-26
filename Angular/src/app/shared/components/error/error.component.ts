import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  @Input() errorMessage: string = '';
  constructor() { }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
  }

}
