import React from 'react';
import { getTechColorStyles } from '../../utils/helpers';

export const TechTag = ({ label }: { label: string }) => (
    <span className={`px-2 py-0.5 text-[10px] md:text-xs font-mono border rounded ${getTechColorStyles(label)} whitespace-nowrap`}>
        {label}
    </span>
);
