<template>
    <v-container grid-list-lg>
        <div class="subheading font-weight-bold">
            Semua Stand
        </div>

        <v-divider class="my-2"></v-divider>
        
        <v-layout row wrap justify-center>
            <v-flex xs12 sm8 lg6>
                <v-text-field
                    solo
                    label="Cari stand"
                    clearable
                    v-model="querySearch"
                >
                    <v-icon>search</v-icon>
                </v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs6 md4 lg3 v-for="(item, id) in getFilteredStands" :key="`stand-${id}`">
                <stand-card :item="item"></stand-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    components: {
        StandCard: () => import('./StandCard' /* webpackChunkName: "js/chunk-stand-card" */),
    },
    data() {
        return {
            stands: [],
            querySearch: "",
        }
    },
    computed: {
        getFilteredStands() {
            if(!!this.querySearch) {
                return this.stands.filter((item) => {
                    const hasName = item.name.toLowerCase().replace(/ /g,'').indexOf(this.querySearch.toLowerCase()) >= 0

                    const hasDesc = item.description.toLowerCase().replace(/ /g,'').indexOf(this.querySearch.toLowerCase()) >= 0
                    
                    return (hasName || hasDesc);
                });
            } else {
                return this.stands;
            }
        },
    },
    methods: {
        async getStands() {
            const res = await axios.get('/api/stands');
            this.stands = res.data;
        }
    },
    mounted() {
        this.getStands();
    }
}
</script>
