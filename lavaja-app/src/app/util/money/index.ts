export const converterEmBigDecimal = (value:any) : number => {
    if(!value){
        return 0
    }
    return value.replace(".", "").replace(",", ".")
}

export const formatReal = (valor: string): string => {
  if (!valor) return '';

  // remove tudo que não for dígito
  const onlyDigits = valor.replace(/\D/g, '');

  if (onlyDigits === '') return '';

  // transforma em número com 2 casas
  const n = parseFloat(onlyDigits) / 100;

  // formata com separadores brasileiros
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

