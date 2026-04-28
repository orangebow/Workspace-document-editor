"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import { Underline } from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Table from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import ImageResize from "tiptap-extension-resize-image"
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { useLiveblocksExtension } from '@liveblocks/react-tiptap'


import { useEditorStore } from '@/store/use-editor-store';
import { FontSize } from '@/extensions/font-size';
import { LineHeight } from '@/extensions/line-height';
import { Ruler } from './ruler';
import { Thread } from '@liveblocks/react-ui';
import { Threads } from './thread';
import { useStorage } from "@liveblocks/react";
import { use } from 'react';
import { initializeTraceState } from 'next/dist/trace';
import { LEFT_MARGIN_DEFAULT } from '@/constants/margins';


interface EditorProps {
  initialContent?: string | undefined;

};


export const Editor = ({ initialContent }: EditorProps) => {

  const leftMargin = useStorage((root) => root.leftMargin);

  const rightMargin = useStorage((root) => root.rightMargin);

  const liveblocks = useLiveblocksExtension({
    initialContent, //identify changes
    offlineSupport_experimental: true,

  });

  const { setEditor } = useEditorStore();


  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },

    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin ?? 56}px; padding-right: ${rightMargin ?? 56}px;`,
        class: 'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
      liveblocks,
      //spreading as .... for availing all the things from the box.
      //Not intially used in the project, but after some research i tried it, but it doesn't work.
      StarterKit.configure({
        history: false,
      }),
      LineHeight.configure({
        types: ["paragraph", "heading"],
        defaultLineHeight: "normal",
      }),
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      Image,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-600 hover:underline",
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
        defaultProtocol: 'https',
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      ImageResize,
      FontFamily,
      Underline,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TaskItem.configure({
        nested: true,
      })
    ],
    /*content: `
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>
      `,*/
  })

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:pg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};