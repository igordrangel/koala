import { Component } from '@angular/core';
import { Section } from '../../../core/components/section';
import { Tabs } from '../../../shared/components/tabs';
import { Textarea } from '../../../shared/components/textarea/textarea';

@Component({
  selector: 'app-textarea-page',
  templateUrl: './textarea.page.html',
  imports: [Section, Tabs, Textarea],
})
export class TextareaPage {}
