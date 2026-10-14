import type { ConfigType } from '@plone/registry';
import DataGridListWidget from '../components/Widgets/DataGridList';

export default function install(config: ConfigType) {
  config.widgets.widget.dataGridList = DataGridListWidget;
  return config;
}
