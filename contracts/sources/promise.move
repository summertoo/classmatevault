module classmate_vault::promise;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::Clock;
    use sui::event;

    /// 生前赠款承诺
    public struct Promise has key, store {
        id: UID,
        creator: address,
        beneficiary: address,
        amount: u64,
        check_in_interval: u64,
        last_check_in: u64,
        is_claimed: bool,
    }

    /// 创建承诺事件
    public struct PromiseCreated has copy, drop {
        promise_id: address,
        creator: address,
        beneficiary: address,
        amount: u64,
        check_in_interval: u64,
    }

    /// 签到事件
    public struct CheckedIn has copy, drop {
        promise_id: address,
        user: address,
        timestamp: u64,
    }

    /// 赠款领取事件
    public struct GiftClaimed has copy, drop {
        promise_id: address,
        beneficiary: address,
        amount: u64,
        timestamp: u64,
    }

    /// 创建生前赠款承诺
    entry fun create_promise(
        beneficiary: address,
        check_in_interval: u64,
        coin: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);
        let promise = Promise {
            id: object::new(ctx),
            creator: ctx.sender(),
            beneficiary,
            amount,
            check_in_interval,
            last_check_in: clock.timestamp_ms(),
            is_claimed: false,
        };

        let promise_id = object::id_address(&promise);

        event::emit(PromiseCreated {
            promise_id,
            creator: ctx.sender(),
            beneficiary,
            amount,
            check_in_interval,
        });

        transfer::share_object(promise);
        transfer::public_transfer(coin, ctx.sender());
    }

    /// 签到，重置计时器
    entry fun check_in(
        promise: &mut Promise,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!promise.is_claimed, 0);
        assert!(ctx.sender() == promise.creator, 1);

        promise.last_check_in = clock.timestamp_ms();

        event::emit(CheckedIn {
            promise_id: object::id_address(promise),
            user: ctx.sender(),
            timestamp: promise.last_check_in,
        });
    }

    /// 领取赠款（超时后由受益人领取）
    entry fun claim_gift(
        promise: &mut Promise,
        coin: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!promise.is_claimed, 0);
        assert!(ctx.sender() == promise.beneficiary, 2);

        let current_time = clock.timestamp_ms();
        let elapsed = current_time - promise.last_check_in;
        let interval_ms = promise.check_in_interval * 1000;

        assert!(elapsed >= interval_ms, 3);

        promise.is_claimed = true;

        event::emit(GiftClaimed {
            promise_id: object::id_address(promise),
            beneficiary: ctx.sender(),
            amount: promise.amount,
            timestamp: current_time,
        });

        transfer::public_transfer(coin, ctx.sender());
    }

    /// 检查是否可以领取
    public fun can_claim(promise: &Promise, clock: &Clock): bool {
        if (promise.is_claimed) {
            return false
        };
        let current_time = clock.timestamp_ms();
        let elapsed = current_time - promise.last_check_in;
        let interval_ms = promise.check_in_interval * 1000;
        elapsed >= interval_ms
    }

    /// 获取承诺信息
    public fun get_promise_info(promise: &Promise): (address, address, u64, u64, u64, bool) {
        (
            promise.creator,
            promise.beneficiary,
            promise.amount,
            promise.check_in_interval,
            promise.last_check_in,
            promise.is_claimed
        )
    }

    /// 获取剩余时间（秒）
    public fun get_remaining_time(promise: &Promise, clock: &Clock): u64 {
        let current_time = clock.timestamp_ms();
        let elapsed = current_time - promise.last_check_in;
        let interval_ms = promise.check_in_interval * 1000;
        if (elapsed >= interval_ms) {
            0
        } else {
            (interval_ms - elapsed) / 1000
        }
    }