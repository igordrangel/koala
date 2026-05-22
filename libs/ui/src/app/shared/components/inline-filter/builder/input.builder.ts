import { InlineFilterInputType } from '../config';
import { BuilderBase } from './builder.base';

export class InputBuilder extends BuilderBase {
  type(type: InlineFilterInputType) {
    this.config.type = 'input';
    this.config.inputType = type;
    return this;
  }

  placeholder(placeholder?: string) {
    this.config.placeholder = placeholder;
    return this;
  }
}
