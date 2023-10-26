import { Directive, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[appLoadStyle]'
})
export class LoadStyleDirective implements OnInit{

    @Input('href') param:  any;

    ngOnInit(): void {
        const node = document.createElement('link');
        node.rel = 'stylesheet';
        node.type = 'text/css';
        node.href = this.param;
        document.getElementsByTagName('head')[0].appendChild(node);
    }

}