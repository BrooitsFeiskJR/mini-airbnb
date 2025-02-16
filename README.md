# Sistema de Reservas de Propriedades - TDD Challenge

Projeto desenvolvido para certificação em Desenvolvimento Orientado a Testes (TDD) com cobertura completa de testes unitários e E2E.

## 🚀 Começando

### Pré-requisitos
- Node.js v18+
- npm v9+

### Instalação
```bash
npm install
```
### 🔍 Executando os Testes
```bash
npm test
```
Os testes incluem:

- Testes unitários de mappers (Property e Booking)

- Testes E2E de criação de usuários e propriedades

- Validação de políticas de reembolso

- Testes de cancelamento de reservas

## 📝 Detalhes Técnicos
### Estrutura do Projeto
```
src/
├── domain/          # Lógica de negócio e entidades
├── application/     # Casos de uso e serviços
├── infrastructure/  # Implementações concretas (web, persistence)
```
## Cobertura de Testes do desáfio técnico
### Mappers
- `property_mapper.test.ts`: Conversão Property/PropertyEntity e validações

- `booking_mapper.test.ts`: Conversão Booking/BookingEntity e validações

### Testes E2E
- `user_controller_e2e.test.ts`: Criação de usuários com validações

- `property_controller_e2e.test.ts`: Criação de propriedades com regras de negócio

### Regras de Negócio
- `refund_rule_factory.test.ts`: Políticas de reembolso (Full/Partial/No Refund)

- `booking_service.test.ts`: Cancelamento de reservas e tratamento de erros

## 🛠 Tecnologias
- __Testes:__ Jest, Supertest

- __ORM:__ TypeORM

- __Banco de Dados:__ SQLite (em memória para testes)

## ✅ Garantia de Qualidade
- 100% dos testes implementados seguindo TDD

- Validações rigorosas de campos obrigatórios

- Tratamento adequado de códigos HTTP

- Testes independentes e isolados

## 📌 Notas Importantes
- Banco de dados em memória utilizado nos testes

- Todas as operações seguem princípios de Clean Architecture
