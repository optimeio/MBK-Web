import React from 'react';
import * as icons from 'lucide-react';

const Icon = ({ name, style, className }) => {
  const componentName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const LucideIcon = icons[componentName];

  if (!LucideIcon) {
    return <span className={className} style={{...style, display: 'inline-block', width: style?.width || '24px', height: style?.height || '24px' }}></span>;
  }

  return <LucideIcon className={className} style={style} />;
};

export default Icon;
