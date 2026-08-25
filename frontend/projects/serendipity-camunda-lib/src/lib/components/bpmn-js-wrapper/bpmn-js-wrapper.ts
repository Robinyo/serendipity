import {
  AfterViewInit,
  Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';

import { Subscription } from 'rxjs';

// Use the package-level default import statement directly to satisfy node16
import BpmnJS from 'bpmn-js';

import { LoggerService } from 'serendipity-utils-lib';

import { ProcessesService } from '../../services/processes/processes.js';

@Component({
  selector: 'bpmn-js-wrapper',
  standalone: true,
  template: `
    <div class="diagram-container">
      <div #canvas class="canvas-element"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bpmn-js-wrapper.scss'
})
export class BpmnJsWrapper implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  @Input() task!: any;

  protected logger = inject(LoggerService);

  protected subscriptions: Subscription[] = [];

  private processesService: ProcessesService = inject(ProcessesService);

  private viewer!: any;
  private xml!: string;

  constructor() {
    this.logger.info('BpmnJsWrapper Component: constructor()');
  }

  ngOnInit(): void {

    // this.viewer = new BpmnViewer({
    //   container: this.canvasRef.nativeElement
    // });

    // Cast the base class engine as any to completely bypass the "not constructable" signature checks
    const BpmnJSConstructor = BpmnJS as any;

    this.viewer = new BpmnJSConstructor({
      container: this.canvasRef.nativeElement
    });

  }

  public ngAfterViewInit() {

    this.logger.info('BpmnJsWrapper Component: ngAfterViewInit()');

    this.subscribe();

  }

  public ngOnChanges(changes: SimpleChanges)  {

    this.logger.info('BpmnJsWrapper Component: ngOnChanges()');

    this.unsubscribe();
    this.subscribe();

  }

  protected subscribe(): void {

    this.logger.info('BpmnJsWrapper Component: subscribe()');

    if (this.task) {

      const subscription: Subscription = this.processesService.getProcessDiagram(this.task.processDefinitionKey).subscribe(

        (response: any) => {

          // this.logger.info('response: ' + JSON.stringify(response, null, 2))

          this.xml = response;

          this.renderDiagram();

        });

      this.subscriptions.push(subscription);

    }

  }

  protected unsubscribe(): void {

    this.logger.info('BpmnJsWrapper Component: unsubscribe()');

    // this.viewer = null;
    this.xml = '';

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

  }

  private async renderDiagram(): Promise<void> {

    this.logger.info('BpmnJsWrapper Component: loadForm()');

    if (this.xml) {

      try {

        await this.viewer.importXML(this.xml);

        const canvas = this.viewer.get('canvas');
        canvas.zoom('fit-viewport');

      } catch (err) {
        //  Failed to execute 'scale' on 'SVGMatrix': The provided float value is non-finite.
        // this.logger.error(err);
      }

    }

  }

  public ngOnDestroy() {

    this.logger.info('BpmnJsWrapper Component: ngOnDestroy()');

    this.unsubscribe();

    if (this.viewer) {
      this.viewer.destroy();
    }

  }

}
