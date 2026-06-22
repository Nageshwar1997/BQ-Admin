import type { TChildren } from '@/types/component.type';
import type { IDropdownOption } from '@/types/input.type';
import { Icon } from '@iconify/react';
import { useMemo, useState, type ReactNode } from 'react';

export interface IHierarchyOption extends IDropdownOption {
  searchLabel?: string;
  children?: IHierarchyOption[];
}

interface ITreeNode {
  node: IHierarchyOption;
  level?: number;
  value?: IDropdownOption['value'];
  expanded: Record<IDropdownOption['value'], boolean>;
  onToggle: (value: IDropdownOption['value']) => void;
  onSelect: (value: IDropdownOption['value']) => void;
}

interface IHierarchySelectProps {
  options: IHierarchyOption[];
  value?: IDropdownOption['value'];
  onChange?: (value: IDropdownOption['value']) => void;
  placeholder?: ReactNode;
}

const IconContainer = ({ children }: TChildren) => (
  <div className="flex size-5 shrink-0 items-center justify-center">{children}</div>
);

const TreeNode = ({ node, level = 0, value, expanded, onToggle, onSelect }: ITreeNode) => {
  const hasChildren = !!node.children?.length;
  const isExpanded = expanded[node.value];
  const isSelected = value === node.value;

  return (
    <>
      <li
        className={`hover:bg-primary/5 flex items-center gap-2 rounded-md px-2 py-2 ${
          isSelected ? 'bg-primary/10' : ''
        } ${node.disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        style={{ paddingLeft: `${level * 10}px` }}
        onClick={() => {
          if (node.disabled) return;

          if (hasChildren) {
            onToggle(node.value);
            return;
          }

          onSelect(node.value);
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            if (!hasChildren) return;

            e.stopPropagation();
            onToggle(node.value);
          }}
          className="flex shrink-0"
        >
          <IconContainer>
            {hasChildren ? (
              <Icon
                icon={isExpanded ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'}
                className="size-4 cursor-pointer"
              />
            ) : null}
          </IconContainer>
        </button>

        <IconContainer>
          <Icon
            icon={
              hasChildren
                ? isExpanded
                  ? 'solar:folder-open-linear'
                  : 'solar:folder-linear'
                : 'solar:file-linear'
            }
            className="size-4"
          />
        </IconContainer>

        <span className="flex-1 text-left text-sm">{node.label}</span>

        {isSelected && (
          <IconContainer>
            <Icon icon="solar:check-circle-linear" className="text-primary size-4" />
          </IconContainer>
        )}
      </li>

      {hasChildren &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeNode
            key={child.value}
            node={child}
            level={level + 1}
            value={value}
            expanded={expanded}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
    </>
  );
};

const HierarchySelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select Category',
}: IHierarchySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string | number, boolean>>({});

  const toggleExpand = (value: string | number) => {
    setExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const filterTree = (nodes: IHierarchyOption[], keyword: string): IHierarchyOption[] => {
    if (!keyword.trim()) return nodes;

    const lower = keyword.toLowerCase();

    return nodes.reduce<IHierarchyOption[]>((acc, node) => {
      const searchableText = node.searchLabel ?? (typeof node.label === 'string' ? node.label : '');

      const matched = searchableText.toLowerCase().includes(lower);

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

  const selectedOption = useMemo(() => {
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

    return find(options);
  }, [options, value]);

  const handleSelect = (value: string | number) => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border px-3"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOption?.label || placeholder}</span>

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

          <ul className="max-h-80 overflow-y-auto p-2 [scrollbar-gutter:stable]">
            {filteredOptions.length ? (
              filteredOptions.map((node) => (
                <TreeNode
                  key={node.value}
                  node={node}
                  value={value}
                  expanded={expanded}
                  onToggle={toggleExpand}
                  onSelect={handleSelect}
                />
              ))
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
