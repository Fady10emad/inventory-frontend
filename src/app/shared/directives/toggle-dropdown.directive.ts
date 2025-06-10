import { Directive, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggleDropdown]',
})
export class ToggleDropdownDirective implements OnDestroy, OnInit {
  clickListener!: () => void;
  targetElement!: HTMLElement;
  private isOpen = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('click') onClick() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.renderer.addClass(this.targetElement, 'show');
      this.clickListener = this.renderer.listen('document', 'click', (e: Event) =>
        this.handleGlobalClick(e)
      );
    } else {
      this.renderer.removeClass(this.targetElement, 'show');
    }
  }

  ngOnInit(): void {
    this.targetElement = this.el.nativeElement.querySelector('.dropdown-menu');
  }

  ngOnDestroy(): void {
    this.removeClickListener();
  }

  private handleGlobalClick(event: Event): void {
    const isClickInside = this.el.nativeElement.contains(event.target);
    if (!isClickInside) {
      this.isOpen = false;
      this.renderer.removeClass(this.targetElement, 'show');
      this.removeClickListener();
    }
  }

  private removeClickListener(): void {
    if (this.clickListener) {
      this.clickListener();
      this.clickListener = undefined as any;
    }
  }
}
