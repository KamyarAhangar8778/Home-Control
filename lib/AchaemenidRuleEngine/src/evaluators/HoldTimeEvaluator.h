#ifndef HOLD_TIME_EVALUATOR_H
#define HOLD_TIME_EVALUATOR_H

#include "../RuleEngine.h"
#include <AchaemenidConfigProtocol.h>

namespace uniuno {
namespace rules {

class HoldTimeEvaluator {
public:
    HoldTimeEvaluator(RuleContext& ctx);
    
    void processRelease(const RuleAction* actions, int count, unsigned long durationSec, int sourcePin);

private:
    RuleContext& _ctx;
    void executeAction(const RuleAction& act, int sourcePin);
};

} // namespace rules
} // namespace uniuno

#endif // HOLD_TIME_EVALUATOR_H
