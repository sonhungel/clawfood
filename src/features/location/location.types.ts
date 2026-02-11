import type { Location } from '../../types';

export interface LocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  address: string | null;
}
