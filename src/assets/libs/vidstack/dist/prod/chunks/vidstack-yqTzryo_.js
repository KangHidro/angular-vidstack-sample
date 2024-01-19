const SET_AUTO = Symbol(0), ENABLE_AUTO = Symbol(0);
const QualitySymbol = {
  Ya: SET_AUTO,
  Za: ENABLE_AUTO
};

function coerceToError(error) {
  return error instanceof Error ? error : Error(JSON.stringify(error));
}

export { QualitySymbol as Q, coerceToError as c };
