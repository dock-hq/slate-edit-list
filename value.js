/** @jsx h */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createHyperscript } from 'slate-hyperscript';

const h = createHyperscript({
  elements: {
    heading: {
      type: 'heading',
    },
    paragraph: {
      type: 'paragraph',
    },
    ul_list: {
      type: 'ul_list',
    },
    ol_list: {
      type: 'ol_list',
    },
    list_item: {
      type: 'list_item',
    },
  },
});

export default (
  <fragment>
    <ul_list>
      <list_item>
        <paragraph>
          9 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </paragraph>
      </list_item>
      <list_item>
        <paragraph>10 Nulla a risus mauris.</paragraph>
        <ul_list>
          <list_item>
            <paragraph>
              4 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </paragraph>
          </list_item>
          <list_item>
            <paragraph>5 Nulla a risus mauris.</paragraph>
            <ul_list>
              <list_item>
                <paragraph>
                  1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </paragraph>
              </list_item>
              <list_item>
                <paragraph>2 Nulla a risus mauris.</paragraph>
              </list_item>
              <list_item>
                <paragraph>
                  3 Vestibulum ut felis ut augue maximus varius a sit amet ex.
                </paragraph>
              </list_item>
            </ul_list>
          </list_item>
          <list_item>
            <paragraph>
              6 Vestibulum ut felis ut augue maximus varius a sit amet ex.
            </paragraph>
          </list_item>
        </ul_list>
      </list_item>
      <list_item>
        <paragraph>
          11 Vestibulum ut felis ut augue maximus varius a sit amet ex.
        </paragraph>
      </list_item>
      <list_item>
        <paragraph>
          12 Vestibulum elementum augue et ipsum aliquam, ut dignissim erat
          lacinia.Maecenas tempor blandit elit, vel mattis nulla.
        </paragraph>
        <ol_list>
          <list_item>
            <paragraph>
              7 Phasellus lectus mauris, lacinia at eros quis, viverra
              vestibulum augue.
            </paragraph>
          </list_item>
          <list_item>
            <paragraph>
              8 Donec nec justo eu risus aliquet ullamcorper sit amet sodales
              tellus.
            </paragraph>
          </list_item>
        </ol_list>
      </list_item>
      <list_item>
        <paragraph>
          13 Donec nec justo eu risus aliquet ullamcorper sit amet sodales
          tellus.
        </paragraph>
      </list_item>
    </ul_list>
  </fragment>
);
