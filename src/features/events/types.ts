export type ConnectionStatus = 'pending' | 'success' | 'failed'

export type ConnectionMessage = {
  status: ConnectionStatus
}
