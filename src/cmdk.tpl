import { history, useAppData, Outlet } from 'umi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { transformRoute } from '@umijs/route-utils';
import { useKeyPress } from 'ahooks';
import { Modal } from 'antd';
import { Command } from 'cmdk';
import React from 'react';
import './cmdk.less';

const _props =  {{{ props }}};

const CommandMenu = () => {
  const {
    keyFilter = 'meta.k',
    suggestionKeys,
    groups,
    searchPlaceholder = '寻找你想去的地方...',
    empty = '迷路了! ! !',
  } =  _props;
  const [open, setOpen] = useState(false);
  const { clientRoutes } = useAppData();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { breadcrumb } = transformRoute(clientRoutes);

  useKeyPress(keyFilter, () => setOpen((open) => !open), {
    target: document,
  });

  useEffect(() => {
    if (open) {
      // 必须得加一个 timeout，不然不会声效
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 50);
    }
  }, [open]);

  const allMenus = useMemo(() => {
    const menus = [];
    const suggestions = [];

    for (const [key, value] of breadcrumb) {
      const isSuggestion = hasSuggestions(key);

      if (value.name && value.hideInMenu !== true && !isSuggestion) {
        menus.push({ key, title: `${value.name}`, icon: value.icon });
      }

      if (isSuggestion) {
        suggestions.push({ key, title: `${value.name}`, icon: value.icon });
      }
    }

    return {
      menus,
      suggestions,
    };
  }, [breadcrumb]);

  function hasSuggestions(key: string) {
    return suggestionKeys?.includes(key) || false;
  }

  function onSelect(item: Item) {
    setOpen(false);

    if (item.action) {
      item.action();
      return;
    }

    history.push(item.key);
  }

  return (
    <>
    <Outlet></Outlet>
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      className="raycast"
      closable={false}
      footer={null}
    >
      <Command label="Command Menu">
        <div cmdk-raycast-top-shine="" />
        <Command.Input
          ref={inputRef}
          autoFocus
          placeholder={searchPlaceholder}
        />
        <hr cmdk-raycast-loader="" />
        <Command.List>
          <Command.Empty>{empty}</Command.Empty>
          {
            allMenus.suggestions.length ? (
                <Command.Group heading="Suggestions">
                    {allMenus.suggestions.map((item) => (
                    <Command.Item
                        key={item.key}
                        value={item.title}
                        onKeyDown={() => onSelect(item)}
                        onSelect={() => onSelect(item)}
                    >
                        {/*{item.icon} */}
                        {item.title}
                        <span cmdk-raycast-meta="">Link</span>
                    </Command.Item>
                    ))}
                </Command.Group>
            ) : null
          }

          {
            allMenus.menus.length ? (
                <Command.Group heading="Menus">
                    {allMenus.menus.map((item) => (
                    <Command.Item
                        value={item.title}
                        key={item.key}
                        onKeyDown={() => onSelect(item)}
                        onSelect={() => onSelect(item)}
                    >
                        {/*{item.icon} */}
                        {item.title}
                        <span cmdk-raycast-meta="">Link</span>
                    </Command.Item>
                    ))}
                </Command.Group>
            ) : null
          }
          {groups?.map((group) => {
            return (
              <Command.Group key={group.groupName} heading={group.groupName}>
                {group.items?.map((item) => {
                  return (
                    <Command.Item
                      key={item.key}
                      value={item.title}
                      onKeyDown={() => onSelect(item)}
                      onSelect={() => onSelect(item)}
                    >
                      {item.title}
                      <span cmdk-raycast-meta="">
                        {item.action ? 'Action' : 'Link'}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            );
          })}
        </Command.List>
      </Command>
    </Modal>
    </>
  );
};

export default CommandMenu;
