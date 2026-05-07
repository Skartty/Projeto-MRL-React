export function formatarMoedaBR(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseMoedaBR(valor) {
  if (typeof valor === "number") return valor;

  const limpo = String(valor || "").replace(/[^\d,.-]/g, "").trim();
  if (!limpo) return 0;

  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;

  return Number.parseFloat(normalizado) || 0;
}

export function normalizarProjeto(projeto) {
  const progresso = projeto.progresso ?? 0;

  return {
    ...projeto,
    clienteId: projeto.cliente_id ?? projeto.clienteId ?? "",
    cliente: projeto.cliente_nome || projeto.cliente || "",
    cpf: projeto.cliente_cpf_cnpj || projeto.cpf || "",
    inicio: projeto.data_contratacao || projeto.inicio || "",
    fim: projeto.previsao_entrega || projeto.fim || "",
    valor: formatarMoedaBR(projeto.valor),
    porcentagem: `${progresso}%`,
    comentarios: projeto.descricao || projeto.comentarios || "",
  };
}

export function normalizarProjetos(projetos) {
  return projetos.map(normalizarProjeto);
}
