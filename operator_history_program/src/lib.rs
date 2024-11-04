use borsh::BorshDeserialize;
use const_str_to_pubkey::str_to_pubkey;
use operator_history_sdk::instruction::OperatorHistoryInstruction;
use solana_program::{
    account_info::AccountInfo, declare_id, entrypoint::ProgramResult, msg,
    program_error::ProgramError, pubkey::Pubkey,
};

use crate::initialize_config::process_initialize_config;

mod initialize_config;

declare_id!(str_to_pubkey(env!("OPERATOR_HISTORY_PROGRAM_ID")));

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    if *program_id != id() {
        return Err(ProgramError::IncorrectProgramId);
    }

    let instruction = OperatorHistoryInstruction::try_from_slice(instruction_data)?;

    match instruction {
        // ------------------------------------------
        // Initialization
        // ------------------------------------------
        OperatorHistoryInstruction::InitializeConfig => {
            msg!("Instruction: InitializeConfig");
            process_initialize_config(program_id, accounts)
        }
    }
}
