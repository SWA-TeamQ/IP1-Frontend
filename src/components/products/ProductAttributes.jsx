import React from 'react';

/**
 * A generic component to display product attributes/details.
 * @param {{ attributes: Object.<string, any> }} props
 */
const ProductAttributes = ({ attributes }) => {
  if (!attributes || Object.keys(attributes).length === 0) return null;

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <h3 className="text-sm font-semibold text-slate-900">Specifications</h3>
      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0 sm:border-0 sm:pt-0">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </dt>
            <dd className="mt-1 text-sm text-slate-900 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProductAttributes;
