use solana_program::{decode_error::DecodeError, program_error::ProgramError};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum OperatorHistoryError {
    #[error("CounterOverflow")]
    CounterOverflow,

    #[error("ArithmeticOverflow")]
    ArithmeticOverflow = 3000,
    #[error("ArithmeticUnderflow")]
    ArithmeticUnderflow,
    #[error("DivisionByZero")]
    DivisionByZero,
}

impl<T> DecodeError<T> for OperatorHistoryError {
    fn type_of() -> &'static str {
        "operator_history"
    }
}

impl From<OperatorHistoryError> for ProgramError {
    fn from(e: OperatorHistoryError) -> Self {
        Self::Custom(e as u32)
    }
}

impl From<OperatorHistoryError> for u64 {
    fn from(e: OperatorHistoryError) -> Self {
        e as Self
    }
}
