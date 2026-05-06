import { InstallComponentFlags } from '../utils/install-component';
import { InstallDirectiveFlags } from '../utils/install-directive';
import { InstallPipeFlags } from '../utils/install-pipe';
import { InstallUtilFlags } from '../utils/install-util';
import { InstallValidatorFlags } from '../utils/install-validator';

export interface InstallResult {
  components: InstallComponentFlags[];
  pipes: InstallPipeFlags[];
  validators: InstallValidatorFlags[];
  directives: InstallDirectiveFlags[];
  utils: InstallUtilFlags[];
  libs: string[];
}
