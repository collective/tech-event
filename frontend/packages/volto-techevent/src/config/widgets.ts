import type { ConfigType } from '@plone/registry';
import DataGridListWidget from '../components/Widgets/DataGridList';

declare module '@plone/types' {
  export interface WidgetsConfigByWidget {
    dataGridList: typeof DataGridListWidget;
  }
}

export default function install(config: ConfigType) {
  config.widgets.widget.dataGridList = DataGridListWidget;
  return config;
}
