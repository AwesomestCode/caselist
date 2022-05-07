import React from 'react';
import Markdown from 'react-markdown';

import { useStore } from '../helpers/store';

import styles from './CaselistHome.module.css';

const CaselistHome = () => {
    const { caselist: caselistData } = useStore();

    const markdown = '# # This would create Heading 1 - For Pocket/Title\n## ## This would create Heading 2 - Hat/Section\n### ### This would create Heading 3 - Block Title/Argument Title\n#### #### This would create Heading 4 - Tag';

    return (
        <div className={styles['caselist-home']}>
            <h1>{caselistData.display_name}</h1>
            <div>
                <p>
                    This site provides a space for collaborative intel for the
                    debate community.
                </p>

                <p>To add a school, use the button on the sidebar.</p>

                <h2>How to use this site</h2>

                <p>
                    You can create cites in markdown syntax or upload directly to the caselist
                    using Verbatim v6+.
                </p>

                <p>
                    On your school home page, you can create new teams by using the form at
                    the bottom.
                </p>

                <p>
                    You are strongly encouraged to use markdown syntax for your cite entries,
                    such as that produced automatically in Verbatim. If you are pasting
                    directly from Word, it will be unformatted text.
                </p>

                <p>You can create heading levels in markdown syntax using #</p>
                <Markdown className="cites">{markdown}</Markdown>
            </div>
        </div>
    );
};

export default CaselistHome;
