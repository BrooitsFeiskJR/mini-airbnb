import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { ParcialRefund } from "./parcial_refund";
import { RefundRule } from "./refund_rule.interface";

export class RefundRuleFactory {
  static getRefundRule(daysUntilCheckIn: number): RefundRule {
    if (daysUntilCheckIn > 7) {
      return new FullRefund();
    }
    if (daysUntilCheckIn >= 1 && daysUntilCheckIn <= 7) {
      return new ParcialRefund();
    }
    return new NoRefund();
  }
}
