/**
 * The docs of each block (`docs.block.md`) are served by `@blocks-schema`
 * next to its schema. These tests keep the two from drifting apart.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BlockConfigBase } from '@plone/types';
import scheduleBlock from './Schedule';
import sponsorsShowcaseBlock from './Sponsors/SponsorsShowcase';
import sponsorLevelBlock from './Sponsors/SponsorLevel';
import levelBenefitsBlock from './Sponsors/LevelBenefits';
import levelComparisonBlock from './Sponsors/LevelComparison';

const here = path.dirname(fileURLToPath(import.meta.url));

const blocks: Array<{ block: BlockConfigBase; folder: string }> = [
  { block: scheduleBlock, folder: 'Schedule' },
  { block: sponsorsShowcaseBlock, folder: 'Sponsors/SponsorsShowcase' },
  { block: sponsorLevelBlock, folder: 'Sponsors/SponsorLevel' },
  { block: levelBenefitsBlock, folder: 'Sponsors/LevelBenefits' },
  { block: levelComparisonBlock, folder: 'Sponsors/LevelComparison' },
];

// The endpoint calls blockSchema with intl and data only.
const intl = {
  formatMessage: (descriptor: { defaultMessage?: string }) =>
    descriptor?.defaultMessage ?? '',
} as any;

describe.each(blocks)('docs of $block.id', ({ block, folder }) => {
  const markdown = fs.readFileSync(
    path.join(here, folder, 'docs.block.md'),
    'utf8',
  );
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const data = { '@type': block.id };
  const schema = (block.blockSchema as any)({ data, intl, props: { data } });
  const examples = [...body.matchAll(/```json\n([\s\S]*?)\n```/g)].map(
    ([, json]) => JSON.parse(json),
  );

  it('resolves its schema from intl and data alone', () => {
    expect(schema.properties).toBeTruthy();
  });

  it('names the block by the id it is registered with', () => {
    expect(frontmatter).toBe(`block: ${block.id}`);
  });

  it('explains every field of the schema', () => {
    for (const field of Object.keys(schema.properties)) {
      expect(body).toContain(`- \`${field}\`: `);
    }
  });

  it('uses no heading above ###', () => {
    expect(body).not.toMatch(/^#{1,2} /m);
  });

  it('has examples that are data for this block', () => {
    expect(examples.length).toBeGreaterThan(0);
    const known = ['@type', ...Object.keys(schema.properties)];
    for (const example of examples) {
      expect(example['@type']).toBe(block.id);
      for (const key of Object.keys(example)) {
        expect(known).toContain(key);
      }
    }
  });

  it('uses each field in at least one example', () => {
    // `styles` is the shared styling widget, documented but not exemplified.
    const fields = Object.keys(schema.properties).filter(
      (field) => field !== 'styles',
    );
    for (const field of fields) {
      expect(examples.some((example) => field in example)).toBe(true);
    }
  });
});
