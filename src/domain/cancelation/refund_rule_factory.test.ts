import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund";
import { ParcialRefund } from "./parcial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe("Refund Rule Factory", () => {
    it("must return FullRefund when a reservation is canceled more than 7 days in advance", () => {
        const rule = RefundRuleFactory.getRefundRule(8) 
        expect(rule).toBeInstanceOf(FullRefund);
    })
    it("must return PartialRefund when the booking is canceled between 1 and 7 days in advance", () => {
        const rule = RefundRuleFactory.getRefundRule(5) 
        expect(rule).toBeInstanceOf(ParcialRefund);
    })
    it("must return NoRefund when booking is canceled less than 1 day in advance", () => {
        const rule = RefundRuleFactory.getRefundRule(0) 
        expect(rule).toBeInstanceOf(NoRefund);
    })
});