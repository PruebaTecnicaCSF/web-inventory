import React from "react";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const Heading = ({ eyebrow, title, description, action }: Props) => {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="heading-description">{description}</p>
      </div>
      {action}
    </div>
  );
};
