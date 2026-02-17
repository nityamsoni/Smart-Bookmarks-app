
"use client";

import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setTheme } from '@/lib/store/theme-slice';

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      dispatch(setTheme(true));
    } else if (saved === 'light') {
      dispatch(setTheme(false));
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(setTheme(true));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ThemeInitializer>{children}</ThemeInitializer>
    </Provider>
  );
}