export type Dimension =
  | "strategie"
  | "content"
  | "kundenpotenzial"
  | "marketing_kanaele"
  | "email_automation"
  | "analytics_funnel"
  | "akquisewege"
  | "verkaufskompetenzen"
  | "vertriebs_skills"
  | "vertriebsengpass";

export type BmcSlot =
  | "customer_segments"
  | "value_proposition"
  | "channels"
  | "customer_relationships"
  | "revenue_streams"
  | "key_activities"
  | "key_resources"
  | "key_partners"
  | "cost_structure";

export interface OmpaQuestion {
  id: string;
  number: number;
  code: string;
  blockId: string;
  blockTitle: string;
  dimension: Dimension;
  text: string;
  helpText: string | null;
  scaleMin: number;
  scaleMax: number;
  scaleLabels: Record<string, string>;
  weight: number;
  priority: number;
  allowComment: boolean;
  bmcMapping: BmcSlot[];
  bmcTemplates: Record<string, string>;
}
