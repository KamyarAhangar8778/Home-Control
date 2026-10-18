#ifndef ACTION_STRATEGIES_H
#define ACTION_STRATEGIES_H

#include "../RuleEngine.h"
#include <AchaemenidConfigProtocol.h>

namespace uniuno {
namespace rules {

class IRuleActionStrategy {
public:
    virtual ~IRuleActionStrategy() = default;
    virtual void execute(const RuleAction& act, int sourcePin, RuleContext& ctx) = 0;
};

class ImmediateActionStrategy : public IRuleActionStrategy {
public:
    void execute(const RuleAction& act, int sourcePin, RuleContext& ctx) override;
};

class DelayedActionStrategy : public IRuleActionStrategy {
public:
    void execute(const RuleAction& act, int sourcePin, RuleContext& ctx) override;
};

class DurationActionStrategy : public IRuleActionStrategy {
public:
    void execute(const RuleAction& act, int sourcePin, RuleContext& ctx) override;
};

} // namespace rules
} // namespace uniuno

#endif // ACTION_STRATEGIES_H
