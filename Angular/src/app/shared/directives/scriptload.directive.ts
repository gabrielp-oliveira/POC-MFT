import { Directive, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[appLoadScript]'
})
export class LoadScriptDirective implements OnInit{

    @Input('script') param:  any;

    ngOnInit(): void {
        const node = document.createElement('script');
        node.src = this.param;
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

}