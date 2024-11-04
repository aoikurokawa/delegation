use config::Config;
use jito_bytemuck::Discriminator;

pub mod config;

/// Discriminators for operator history accounts
/// Values must not change as they are written on chain to determine the type of account
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OperatorHistoryDiscriminator {
    Config = 1,
}

impl Discriminator for Config {
    const DISCRIMINATOR: u8 = OperatorHistoryDiscriminator::Config as u8;
}
