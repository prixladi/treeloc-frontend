import React, { ReactNode, useEffect } from 'react';

type PageProps = {
  title: string;
  children: ReactNode[] | ReactNode;
};

const Page: React.FC<PageProps> = ({ title, children }: PageProps) => {
  useEffect(() => {
    document.title = title;
  });

  return <> {children} </>;
};

export { Page };
