'use client';
import * as stylex from '@stylexjs/stylex';
import { MdClose } from 'react-icons/md';
import { styles } from './index.stylex';

export type LinkEntry = { id: string; title: string; url: string };

interface LinksEditorProps {
   links: LinkEntry[];
   onChange: (links: LinkEntry[]) => void;
}

export default function LinksEditor({ links, onChange }: LinksEditorProps) {
   function addLink() {
      if (links.length >= 5) return;
      onChange([...links, { id: crypto.randomUUID(), title: '', url: '' }]);
   }

   function removeLink(id: string) {
      onChange(links.filter(link => link.id !== id));
   }

   function updateLink(id: string, field: keyof Omit<LinkEntry, 'id'>, value: string) {
      onChange(links.map(link => (link.id === id ? { ...link, [field]: value } : link)));
   }

   return (
      <div {...stylex.props(styles.root)}>
         {links.map(link => (
            <div key={link.id} {...stylex.props(styles.linkRow)}>
               <input
                  {...stylex.props(styles.input)}
                  type="text"
                  placeholder="Title"
                  value={link.title}
                  onChange={e => updateLink(link.id, 'title', e.target.value)}
               />
               <input
                  {...stylex.props(styles.input)}
                  type="url"
                  placeholder="URL (https://...)"
                  value={link.url}
                  onChange={e => updateLink(link.id, 'url', e.target.value)}
               />
               <button
                  type="button"
                  {...stylex.props(styles.removeBtn)}
                  onClick={() => removeLink(link.id)}
               >
                  <MdClose size={16} />
               </button>
            </div>
         ))}
         {links.length < 5 && (
            <button type="button" {...stylex.props(styles.addBtn)} onClick={addLink}>
               + Add link
            </button>
         )}
      </div>
   );
}
