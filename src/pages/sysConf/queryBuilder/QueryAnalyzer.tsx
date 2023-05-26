import { useState } from "react";
import type { Field, RuleGroupType } from "react-querybuilder";
import { QueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.scss";

const initialQuery: RuleGroupType = { combinator: "and", rules: [] };

export const App = () => {
  const [query, setQuery] = useState(initialQuery);
  const fields: Field[] = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
  ];

  return (
    <QueryBuilder
      fields={fields}
      query={query}
      onQueryChange={(q) => setQuery(q)}
    />
  );
};
