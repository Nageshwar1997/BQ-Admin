export interface IHierarchyOption {
  label: string;
  value: string;
  disabled?: boolean;
  children?: IHierarchyOption[];
}

import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';

export interface IHierarchyOption {
  label: string;
  value: string;
  disabled?: boolean;
  children?: IHierarchyOption[];
}

interface IHierarchySelectProps {
  options: IHierarchyOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const HierarchySelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select Category',
}: IHierarchySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (value: string) => {
    setExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const filterTree = (nodes: IHierarchyOption[], keyword: string): IHierarchyOption[] => {
    if (!keyword.trim()) return nodes;

    const lower = keyword.toLowerCase();

    return nodes.reduce<IHierarchyOption[]>((acc, node) => {
      const matched = node.label.toLowerCase().includes(lower);

      const children = node.children ? filterTree(node.children, keyword) : [];

      if (matched || children.length) {
        acc.push({
          ...node,
          children,
        });
      }

      return acc;
    }, []);
  };

  const filteredOptions = useMemo(() => filterTree(options, search), [options, search]);

  const selectedLabel = useMemo(() => {
    const find = (items: IHierarchyOption[]): IHierarchyOption | undefined => {
      for (const item of items) {
        if (item.value === value) return item;

        if (item.children?.length) {
          const found = find(item.children);

          if (found) return found;
        }
      }

      return undefined;
    };

    return find(options)?.label;
  }, [options, value]);

  const TreeNode = ({ node, level = 0 }: { node: IHierarchyOption; level?: number }) => {
    const hasChildren = !!node.children?.length;
    const isExpanded = expanded[node.value];
    const isSelected = value === node.value;

    return (
      <>
        <li
          className={`hover:bg-primary/5 flex items-center gap-2 rounded-md px-2 py-2 ${
            isSelected ? 'bg-primary/10' : ''
          }`}
          style={{
            paddingLeft: `${level * 20 + 8}px`,
          }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(node.value)}
              className="flex shrink-0"
            >
              <Icon
                icon={isExpanded ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'}
                className="size-4"
              />
            </button>
          ) : (
            <div className="w-4" />
          )}

          <Icon
            icon={
              hasChildren
                ? isExpanded
                  ? 'solar:folder-open-linear'
                  : 'solar:folder-linear'
                : 'solar:file-linear'
            }
            className="size-4 shrink-0"
          />

          <button
            type="button"
            className={`flex-1 text-left text-sm ${
              node.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            onClick={() => {
              if (node.disabled) return;

              if (!hasChildren) {
                onChange?.(node.value);
                setIsOpen(false);
              }
            }}
          >
            {node.label}
          </button>

          {isSelected && <Icon icon="solar:check-circle-linear" className="text-primary size-4" />}
        </li>

        {hasChildren &&
          isExpanded &&
          node.children?.map((child) => (
            <TreeNode key={child.value} node={child} level={level + 1} />
          ))}
      </>
    );
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="flex h-12 w-full items-center justify-between rounded-lg border px-3"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedLabel || placeholder}</span>

        <Icon
          icon="solar:alt-arrow-down-linear"
          className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          <div className="p-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-10 w-full rounded-md border px-3 text-sm outline-none"
            />
          </div>

          <ul className="max-h-80 overflow-y-auto p-2">
            {filteredOptions.length ? (
              filteredOptions.map((node) => <TreeNode key={node.value} node={node} />)
            ) : (
              <li className="p-3 text-center text-sm opacity-60">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HierarchySelect;
