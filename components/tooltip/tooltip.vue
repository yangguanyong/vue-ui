<template>
    <div :class="[prefixCls]" @mouseenter="handleShowPopper" @mouseleave="handleClosePopper">
        <div :class="[prefixCls + '-rel']" ref="reference">
            <slot></slot>
        </div>
        <transition name="fade">
            <div
                :class="[prefixCls + '-popper', prefixCls + '-' + theme]"
                :style="dropStyles"
                ref="popper"
                v-show="!disabled && (visible || always)"
                @mouseenter="handleShowPopper"
                @mouseleave="handleClosePopper"
                :data-transfer="transfer"
                v-transfer-dom>
                <div :class="[prefixCls + '-content']">
                    <div :class="[prefixCls + '-arrow']"></div>
                    <div :class="innerClasses" :style="innerStyles"><slot name="content">{{ content }}</slot></div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Popper from './popper';
    import TransferDom from './transfer-dom';
    import util from '../../utils/util';
    import { transferIndex, transferIncrease } from './transfer-queue';

    const prefixCls = 't-tooltip';

    export default {
        name: 't-tooltip',
        directives: { TransferDom },
        mixins: [Popper],
        props: {
            placement: {
                validator (value) {
                    return util.oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom'
            },
            content: {
                type: [String, Number],
                default: ''
            },
            delay: {
                type: Number,
                default: 100
            },
            disabled: {
                type: Boolean,
                default: false
            },
            controlled: {    // under this prop,Tooltip will not close when mouseleave
                type: Boolean,
                default: false
            },
            always: {
                type: [String, Boolean],
                default: false
            },
            transfer: {
                type: Boolean,
                default () {
                    return false
                }
            },
            theme: {
                validator (value) {
                    return util.oneOf(value, ['dark', 'light','yellow']);
                },
                default: 'dark'
            },
            maxWidth: {
                type: [String, Number]
            },
            zIndex: {
                type: [String, Number],
                default: '1060'
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                tIndex: this.handleGetIndex()
            };
        },
        computed: {
            innerStyles () {
                const styles = {};
                if (this.maxWidth) styles['max-width'] = `${this.maxWidth}px`;
                return styles;
            },
            innerClasses () {
                return [
                    `${prefixCls}-inner`,
                    {
                        [`${prefixCls}-inner-with-width`]: !!this.maxWidth
                    }
                ];
            },
            dropStyles () {
                let styles = {};
                if (this.transfer) styles['z-index'] = 1060 + this.tIndex;
                if (this.zIndex) styles['z-index'] = this.zIndex;
                return styles;
            }
        },
        watch: {
            content () {
                this.updatePopper();
            }
        },
        methods: {
            handleShowPopper() {
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.visible = true;
                }, this.delay);
                this.tIndex = this.handleGetIndex();
            },
            handleClosePopper() {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    if (!this.controlled) {
                        this.timeout = setTimeout(() => {
                            this.visible = false;
                        }, 100);
                    }
                }
            },
            handleGetIndex () {
                transferIncrease();
                return transferIndex;
            },
        },
        mounted () {
            if (this.always) {
                this.updatePopper();
            }
        }
    };
    
</script>
