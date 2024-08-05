import { SelectDataProps } from "../components/external/startup/startup-form";

interface ComparationType {
  key: "equal" | "greater_than" | "less_than";
  label_pt: string;
  label_en: string;
}

interface Option {
  value: string;
  label_pt: string;
  label_en: string;
}

export interface Rule {
  key: string;
  rule_en: string;
  rule_pt: string;
  comparation_type: ComparationType[];
  field_type:
    | "multiple_select"
    | "single_select"
    | "datepicker"
    | "numeric_input";
  options?: Option[];
}

const convertToOptions = (
  data: any[],
  namePt: string,
  nameEn: string
): Option[] => {
  return data?.map((item) => ({
    value: item.code,
    label_pt: item[namePt] || item.name || "",
    label_en: item[nameEn] || item.name || "",
  }));
};

export const createRules = (data: SelectDataProps): Rule[] => {
  return [
    {
      key: "vertical",
      rule_en: "Vertical",
      rule_pt: "Vertical",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "multiple_select",
      options: convertToOptions(data?.vertical, "name_pt", "name_en"),
    },
    {
      key: "operational_stage",
      rule_en: "Operation Stage",
      rule_pt: "Estágio de operação",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "multiple_select",
      options: convertToOptions(data?.operational_stage, "name_pt", "name_en"),
    },
    {
      key: "business_model",
      rule_en: "Business Model",
      rule_pt: "Modelo de negócio",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "multiple_select",
      options: convertToOptions(data?.business_model, "name_pt", "name_en"),
    },
    {
      key: "foundation_date",
      rule_en: "Foundation Date",
      rule_pt: "Data de fundação",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "datepicker",
    },
    {
      key: "objectives",
      rule_en: "Desired Connections",
      rule_pt: "Conexões desejadas",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "multiple_select",
      options: convertToOptions(data?.objectives, "name_pt", "name_en"),
    },
    {
      key: "challenges",
      rule_en: "Challenges",
      rule_pt: "Desafios",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "multiple_select",
      options: convertToOptions(data?.challenges, "name_pt", "name_en"),
    },
    {
      key: "employees_quantity",
      rule_en: "Number of Employees",
      rule_pt: "Quantos funcionários trabalham na Startup?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "numeric_input",
    },
    {
      key: "fulltime_employees_quantity",
      rule_en: "Fully Involved Team Members",
      rule_pt: "Quantas pessoas da equipe estão 100% envolvidas na Startup?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "numeric_input",
    },
    {
      key: "partners_quantity",
      rule_en: "Number of Partners",
      rule_pt: "Quantidade de sócios",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "numeric_input",
    },
    {
      key: "service_products",
      rule_en: "Type of Service",
      rule_pt: "Tipo de serviço",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "multiple_select",
      options: convertToOptions(data?.service_products, "name_pt", "name_en"),
    },
    {
      key: "quantity_ods_goals",
      rule_en: "Attended SDGs",
      rule_pt: "ODS atendidas",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        {
          value: "1",
          label_pt: "1. Erradicação da Pobreza",
          label_en: "1. No Poverty",
        },
        { value: "2", label_pt: "2. Fome Zero", label_en: "2. Zero Hunger" },
        {
          value: "3",
          label_pt: "3. Boa Saúde e Bem-Estar",
          label_en: "3. Good Health and Well-being",
        },
        {
          value: "4",
          label_pt: "4. Educação de Qualidade",
          label_en: "4. Quality Education",
        },
        {
          value: "5",
          label_pt: "5. Igualdade de Gênero",
          label_en: "5. Gender Equality",
        },
      ],
    },
    {
      key: "maturity_level",
      rule_en: "Technology Maturity Level",
      rule_pt: "Nívem de maturidade tecnológica",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: convertToOptions(data?.maturity_level, "name_pt", "name_en"),
    },
    {
      key: "has_patent",
      rule_en: "Patent",
      rule_pt: "Possui patente",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        {
          value: "em_processo",
          label_pt: "Em processo de obtenção",
          label_en: "In process of obtaining",
        },
      ],
    },
    {
      key: "is_startup_officially_registered",
      rule_en: "Officially Registered with Social Contract",
      rule_pt:
        "A empresa está oficialmente registrada em seu país com um contrato social?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        {
          value: "em_processo",
          label_pt: "Em processo de registro",
          label_en: "In process of registration",
        },
      ],
    },
    {
      key: "is_there_partners_agreement_signed",
      rule_en: "Partner Agreement",
      rule_pt: "Existe um acordo de Sócios assinados pelos sócios?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        {
          value: "em_processo",
          label_pt: "Em processo de elaboração",
          label_en: "In process of elaboration",
        },
      ],
    },
    {
      key: "have_legal_advice",
      rule_en: "Legal Advice",
      rule_pt: "A Startup possui uma assessoria jurídica?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        { value: "parcial", label_pt: "Parcialmente", label_en: "Partially" },
      ],
    },
    {
      key: "have_accounting_advice",
      rule_en: "Accounting Advice",
      rule_pt: "A Startup possui uma assessoria contábil?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        { value: "parcial", label_pt: "Parcialmente", label_en: "Partially" },
      ],
    },
    {
      key: "relationships_registered_in_contract",
      rule_en: "Contract Registration",
      rule_pt:
        "Todas as relações com Clientes, Fornecedores, Parceiros e Funcionários estão devidamente registrados em contrato?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        { value: "parcial", label_pt: "Parcialmente", label_en: "Partially" },
      ],
    },
    {
      key: "customers_quantity",
      rule_en: "Number of Paying Clients",
      rule_pt: "Quantos clientes pagantes possui?",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "numeric_input",
    },
    {
      key: "active_customers_quantity",
      rule_en: "Total Active Clients",
      rule_pt: "Total de clientes ativos",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "numeric_input",
    },
    {
      key: "already_earning",
      rule_en: "Already Generating Revenue",
      rule_pt: "Já está faturando",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
      ],
    },
    {
      key: "is_there_open_investment_round",
      rule_en: "Investment Round",
      rule_pt: "Existe uma rodada de investimento",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
      ],
      field_type: "single_select",
      options: [
        { value: "sim", label_pt: "Sim", label_en: "Yes" },
        { value: "nao", label_pt: "Não", label_en: "No" },
        {
          value: "planejando",
          label_pt: "Planejando para o futuro próximo",
          label_en: "Planning for the near future",
        },
      ],
    },
    {
      key: "startup_investiments_rounds",
      rule_en: "Number of Investments Received",
      rule_pt: "Quantidade de investimentos recebidos",
      comparation_type: [
        { key: "equal", label_pt: "É igual", label_en: "Equal" },
        {
          key: "greater_than",
          label_pt: "Maior que",
          label_en: "Greater than",
        },
        { key: "less_than", label_pt: "Menor que", label_en: "Less than" },
      ],
      field_type: "numeric_input",
    },
  ];
};
